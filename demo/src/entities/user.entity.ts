import { Entity, PrimaryKey, Property, OneToOne, OneToMany, Collection } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Company } from './company.entity';

@Entity()
export class User {
  @PrimaryKey()
  id: string = v4();

  @Property()
  firstName!: string;

  @Property()
  lastName!: string;

  @Property({ unique: true })
  email!: string;

  @Property()
  accountType!: 'individual' | 'business' | 'admin';

  @Property({ nullable: true })
  adminCode?: string;

  @Property({ default: false })
  hasCompanyInfo: boolean = false;

  @OneToOne(() => Company, company => company.user, { nullable: true })
  company?: Company;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(data: Partial<User> = {}) {
    Object.assign(this, data);
  }
}
