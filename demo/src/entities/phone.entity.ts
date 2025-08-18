import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Company } from './company.entity';

@Entity()
export class Phone {
  @PrimaryKey()
  id: string = v4();

  @Property()
  phoneNumber!: string;

  @Property()
  phoneType!: 'mobile' | 'landline';

  @ManyToOne(() => Company)
  company!: Company;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(data: Partial<Phone> = {}) {
    Object.assign(this, data);
  }
}
