import { Prop } from '@nestjs/mongoose';
import { snowflake } from '../utils';

export abstract class Base {
    @Prop({ type: String, default: () => Number(snowflake.generate()) })
    _id: string;

    @Prop({ default: () => new Date() })
    readonly createdAt!: Date;

    @Prop({ default: () => new Date() })
    readonly updatedAt!: Date;
}