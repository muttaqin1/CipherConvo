import { SwaggerDefinitionConstant } from 'swagger-express-ts';

export default {
  // AuthController DTO Models
  LoginDto: {
    description: 'Login DTO.',
    properties: {
      email: {
        description: 'Email of the account.',
        type: SwaggerDefinitionConstant.Model.Property.Type.STRING
      },
      userName: {
        description: 'Username of the account.',
        type: SwaggerDefinitionConstant.Model.Property.Type.STRING
      },
      password: {
        description: 'Password of the account.',
        type: SwaggerDefinitionConstant.Model.Property.Type.STRING,
        required: true
      }
    }
  },
  SignupDto: {
    description: 'Signup DTO.',
    properties: {
      userName: {
        description: 'Username of the account.',
        required: true,
        type: SwaggerDefinitionConstant.Model.Property.Type.STRING
      },
      firstName: {
        description: 'First name of the user.',
        required: true,
        type: SwaggerDefinitionConstant.Model.Property.Type.STRING
      },
      lastName: {
        description: 'Last name of the user.',
        required: true,
        type: SwaggerDefinitionConstant.Model.Property.Type.STRING
      },
      email: {
        description: 'Email of the user.',
        required: true,
        type: SwaggerDefinitionConstant.Model.Property.Type.STRING
      },
      gender: {
        description: 'Gender of the user.',
        required: true,
        enum: ['male', 'female'],
        type: SwaggerDefinitionConstant.Model.Property.Type.STRING
      },
      password: {
        description: 'Password of the user.',
        required: true,
        type: SwaggerDefinitionConstant.Model.Property.Type.STRING
      }
    }
  },
  TokenRefreshDto: {
    description: 'Token Refresh DTO',
    properties: {
      refreshToken: {
        description: 'Refresh Token.',
        required: true,
        type: SwaggerDefinitionConstant.Model.Property.Type.STRING
      }
    }
  },
  VerifyAccountDto: {
    description: 'Verify Account DTO.',
    properties: {
      email: {
        description: 'Email.',
        required: true,
        type: SwaggerDefinitionConstant.Model.Property.Type.STRING
      }
    }
  },
  VerifyVerificationTokenDto: {
    description: 'Verify Verification Token DTO.',
    properties: {
      token: {
        description: 'Token.',
        required: true,
        type: SwaggerDefinitionConstant.Model.Property.Type.STRING
      }
    }
  },
  ResetPasswordDto: {
    description: 'Reset password DTO.',
    properties: {
      password: {
        description: 'New Password.',
        required: true,
        type: SwaggerDefinitionConstant.Model.Property.Type.STRING
      }
    }
  },
  ChangePasswordDto: {
    description: 'Change Password DTO',
    properties: {
      oldPassword: {
        description: 'Old Password of the User.',
        required: true,
        type: SwaggerDefinitionConstant.Model.Property.Type.STRING
      },
      newPassword: {
        description: 'New Password of the User.',
        required: true,
        type: SwaggerDefinitionConstant.Model.Property.Type.STRING
      }
    }
  },

  // UserController DTO Models
  UpdateUsernameDto: {
    description: "Update username",
    properties: {
      userName: {
        description: "New Username",
        required: true,
        type: SwaggerDefinitionConstant.Model.Property.Type.STRING     
      }
    }
  },
  UpdateUserDTO: {
    description: "Update User Credentials DTO",
    properties: {
      firstName: {
        description: "First name of the user",
        type: SwaggerDefinitionConstant.Model.Property.Type.STRING
      },
      lastName: {
        description: "Last name of the user",
        type: SwaggerDefinitionConstant.Model.Property.Type.STRING
      },
      gender: {
        description: "Gender Of the user",
        type: SwaggerDefinitionConstant.Model.Property.Type.STRING,
        enum: ['male','female']
      },
    }
  },

  // AuthController Response Models
  LoginResponse: {
    description: 'Login Response.',
    properties: {
      user: {
        description: 'User data.',
        required: true,
        model: 'UserModel',
        type: 'UserModel'
      },
      roles: {
        description: 'Role data.',
        required: true,
        type: 'RoleModel',
        model: 'RoleModel'
      },
      tokens: {
        description: 'Token data.',
        required: true,
        type: 'TokenModel',
        model: 'TokenModel'
      }
    }
  },
  SignupResponse: {
    description: 'Signup Response.',
    properties: {
      user: {
        description: 'User data.',
        required: true,
        model: 'UserModel',
        type: 'UserModel'
      },
      roles: {
        description: 'Role data.',
        required: true,
        model: 'RoleModel',
        type: 'RoleModel'
      },
      tokens: {
        description: 'Token data.',
        required: true,
        model: 'TokenModel',
        type: 'TokenModel'
      }
    }
  },

  // User model
  UserModel: {
    description: 'User Description.',
    properties: {
      id: {
        description: 'Id of the account.',
        required: true,
        type: SwaggerDefinitionConstant.Model.Property.Type.STRING
      },
      userName: {
        description: 'Username of the account.',
        required: true,
        type: SwaggerDefinitionConstant.Model.Property.Type.STRING
      },
      firstName: {
        description: 'First name of the user.',
        required: true,
        type: SwaggerDefinitionConstant.Model.Property.Type.STRING
      },
      lastName: {
        description: 'Last name of the user.',
        required: true,
        type: SwaggerDefinitionConstant.Model.Property.Type.STRING
      },
      gender: {
        description: 'Gender of the user.',
        required: true,
        enum: ['male', 'female'],
        type: SwaggerDefinitionConstant.Model.Property.Type.STRING
      },
      email: {
        description: 'Email of the user.',
        required: true,
        type: SwaggerDefinitionConstant.Model.Property.Type.STRING
      },
      password: {
        description: 'Password of the user.',
        required: true,
        type: SwaggerDefinitionConstant.Model.Property.Type.STRING
      },
      avatar: {
        description: 'Avatar of the user',
        required: true,
        type: SwaggerDefinitionConstant.Model.Property.Type.STRING
      },
      createdAt: {
        description: 'Account create time',
        required: true,
        type: SwaggerDefinitionConstant.Model.Property.Type.STRING,
        format: SwaggerDefinitionConstant.Model.Property.Format.DATE_TIME
      },
      updatedAt: {
        description: 'Account update time',
        required: true,
        type: SwaggerDefinitionConstant.Model.Property.Type.STRING,
        format: SwaggerDefinitionConstant.Model.Property.Format.DATE_TIME
      }
    }
  },
  RoleModel: {
    description: 'Role Description',
    properties: {
      id: {
        description: 'ID of the role record.',
        required: true,
        type: SwaggerDefinitionConstant.Model.Property.Type.STRING
      },
      admin: {
        description: 'A Boolean value to describe User Authorities',
        required: true,
        type: SwaggerDefinitionConstant.Model.Property.Type.BOOLEAN
      },
      user: {
        description: 'A Boolean value to describe User Authorities',
        required: true,
        type: SwaggerDefinitionConstant.Model.Property.Type.BOOLEAN
      },
      userId: {
        description: 'ID of the User',
        required: true,
        type: SwaggerDefinitionConstant.Model.Property.Type.STRING
      },
      createdAt: {
        description: 'Account Create time.',
        required: true,
        type: SwaggerDefinitionConstant.Model.Property.Type.STRING,
        format: SwaggerDefinitionConstant.Model.Property.Format.DATE_TIME
      },
      updatedAt: {
        description: 'Account Update time.',
        required: true,
        type: SwaggerDefinitionConstant.Model.Property.Type.STRING,
        format: SwaggerDefinitionConstant.Model.Property.Format.DATE_TIME
      }
    }
  },
  TokenModel: {
    description: 'Token Description',
    properties: {
      accessToken: {
        description: 'Access Token',
        required: true,
        type: SwaggerDefinitionConstant.Model.Property.Type.STRING
      },
      refreshToken: {
        description: 'Refresh Token',
        required: true,
        type: SwaggerDefinitionConstant.Model.Property.Type.STRING
      }
    }
  }
};
