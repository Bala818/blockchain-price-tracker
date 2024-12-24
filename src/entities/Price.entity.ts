import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Price {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    chain: string;

    @Column('decimal', { precision: 12, scale: 6 })
    price: number;

    @CreateDateColumn()
    timestamp: Date;
}
