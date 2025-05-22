export type User = {
 
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: UserRole;
   
    
  };
export type UserRole={
    id: number;
    name: string;
}
  
  export type AuthState = {
    accessToken: string | null;
    refreshToken: string | null;
    user: User | null;
    loading: boolean;
    error: string | null;
  };

  