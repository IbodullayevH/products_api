import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn({ type: "int" })
    id: number;

    @Column({ unique: true, nullable: true, type: "varchar", length: 300 })
    name: string;

    @Column({ nullable: true, type: "text" })
    image: string;

    @Column({ nullable: true, type: "bigint" })
    price: number;
    
    @Column({ nullable: true, type: "bigint" })
    miqdor: number;
}
