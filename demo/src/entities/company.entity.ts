import { Entity, PrimaryKey, Property, OneToOne, OneToMany, Collection } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { User } from './user.entity';
import { Phone } from './phone.entity';

@Entity()
export class Company {
  @PrimaryKey()
  id: string = v4();

  @Property()
  name!: string;

  @Property({ nullable: true })
  address?: string;

  @Property({ nullable: true })
  city?: string;

  @Property({ default: false })
  providePhoneNo: boolean = false;

  @OneToOne(() => User, user => user.company, { owner: true })
  user!: User;

  @OneToMany(() => Phone, phone => phone.company)
  phones = new Collection<Phone>(this);

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(data: Partial<Company> = {}) {
    Object.assign(this, data);
  }
}
