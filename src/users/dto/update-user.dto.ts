import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto,CreateUserAccount } from './create-user.dto';


class UpdateUserDto extends PartialType(CreateUserDto) {}

class UpdateUserAccount extends PartialType(CreateUserAccount){}

export {UpdateUserDto,UpdateUserAccount}