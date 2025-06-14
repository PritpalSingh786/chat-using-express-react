import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1749887733038 implements MigrationInterface {
    name = 'InitialMigration1749887733038'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post_entity\` ADD \`userId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`post_entity\` ADD CONSTRAINT \`FK_5e32998d7ac08f573cde04fbfa5\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`uuid\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post_entity\` DROP FOREIGN KEY \`FK_5e32998d7ac08f573cde04fbfa5\``);
        await queryRunner.query(`ALTER TABLE \`post_entity\` DROP COLUMN \`userId\``);
    }

}
