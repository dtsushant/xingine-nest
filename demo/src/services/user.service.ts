import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/core';
import { User } from '../entities/user.entity';
import { Company } from '../entities/company.entity';
import { Phone } from '../entities/phone.entity';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(Company)
    private readonly companyRepository: EntityRepository<Company>,
    @InjectRepository(Phone)
    private readonly phoneRepository: EntityRepository<Phone>,
    private readonly em: EntityManager,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.em.transactional(async (em) => {
      // Create user without company data first
      const { company: companyData, ...userData } = createUserDto;
      const user = new User(userData);

      if (createUserDto.hasCompanyInfo && createUserDto.company) {
        // Create company without phones data
        const { phones: phonesData, ...companyFields } = createUserDto.company;
        const company = new Company(companyFields);
        company.user = user;
        user.company = company;

        if (createUserDto.company.providePhoneNo && phonesData) {
          for (const phoneData of phonesData) {
            const phone = new Phone(phoneData);
            phone.company = company;
            company.phones.add(phone);
          }
        }
      }

      await em.persistAndFlush(user);
      return user;
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll({
      populate: ['company', 'company.phones'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne(
      { id },
      { populate: ['company', 'company.phones'] }
    );

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.em.transactional(async (em) => {
      const user = await this.findOne(id);

      // Update user properties
      Object.assign(user, updateUserDto);

      // Handle company updates
      if (updateUserDto.hasCompanyInfo && updateUserDto.company) {
        if (user.company) {
          // Update existing company
          Object.assign(user.company, updateUserDto.company);

          // Update phones
          if (updateUserDto.company.providePhoneNo && updateUserDto.company.phones) {
            // Remove existing phones
            user.company.phones.removeAll();

            // Add new phones
            for (const phoneData of updateUserDto.company.phones) {
              const phone = new Phone(phoneData);
              phone.company = user.company;
              user.company.phones.add(phone);
            }
          }
        } else {
          // Create new company
          const company = new Company(updateUserDto.company as unknown as Company);
          company.user = user;
          user.company = company;

          if (updateUserDto.company.providePhoneNo && updateUserDto.company.phones) {
            for (const phoneData of updateUserDto.company.phones) {
              const phone = new Phone(phoneData);
              phone.company = company;
              company.phones.add(phone);
            }
          }
        }
      } else if (updateUserDto.hasCompanyInfo === false && user.company) {
        // Remove company if hasCompanyInfo is set to false
        await em.removeAndFlush(user.company);
        user.company = undefined;
      }

      await em.persistAndFlush(user);
      return user;
    });
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.em.removeAndFlush(user);
  }

  async seed(): Promise<void> {
    // Create sample users for development
    const sampleUsers = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        accountType: 'individual' as const,
        hasCompanyInfo: false,
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@businesscorp.com',
        accountType: 'business' as const,
        hasCompanyInfo: true,
        company: {
          name: 'Business Corp',
          address: '123 Business St',
          city: 'New York',
          providePhoneNo: true,
          phones: [
            { phoneNumber: '+1-555-0123', phoneType: 'mobile' as const },
            { phoneNumber: '+1-555-0124', phoneType: 'landline' as const },
          ],
        },
      },
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@system.com',
        accountType: 'admin' as const,
        adminCode: 'ADMIN2024',
        hasCompanyInfo: false,
      },
    ];

    for (const userData of sampleUsers) {
      try {
        await this.create(userData);
        console.log(`✓ Created sample user: ${userData.email}`);
      } catch (error) {
        console.log(`✗ User ${userData.email} already exists`);
      }
    }
  }
}
