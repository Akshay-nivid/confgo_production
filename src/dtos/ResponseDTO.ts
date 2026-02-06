// src/dtos/ResponseDTO.ts

export interface ResponseDTO<T> {
  status: string;
  message?: string;
  data?: T;
}

export const createResponse = <T>({
  status,
  data,
  message = 'success',
}: {
  status: string;
  data?: T;
  message?: string;
}): ResponseDTO<T> => {
  return {
    status,
    message,
    data,
  };
};
