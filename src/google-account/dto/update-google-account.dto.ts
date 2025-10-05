import { PartialType } from '@nestjs/mapped-types';
import { CreateGoogleAccountDto } from './create-google-account.dto';

export class UpdateGoogleAccountDto extends PartialType(CreateGoogleAccountDto) {}
