// src/app/models/auth-response.dto.ts
export interface AuthResponseDTO {
  token: string;
  idUser: number;
}

// src/app/models/login.dto.ts
export interface LoginDto {
  username: string;
  password: string;
}
