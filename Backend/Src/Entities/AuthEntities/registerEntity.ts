// Define and export the RegisterInput interface
export interface RegisterInput {
    name: string;
    email: string;
    password: string;
    role: string;
    appSource: number;
  }
  
  // Define the Register class
  export class Register {
    name: string;
    email: string;
    password: string;
    role: string;
    appSource: number;
  
    constructor(data: RegisterInput) {
      this.name = data.name;
      this.email = data.email;
      this.password = data.password;
      this.role = data.role;
      this.appSource = data.appSource;
    }
  }
  