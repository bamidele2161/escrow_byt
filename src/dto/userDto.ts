export class CreateWaitListDto {
  fullName: string;
  email: string;
  phone: string;
}

export class CreateWaitListResponseDto {
  message: string;
  data: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
  };
  statusCode: number;
}
