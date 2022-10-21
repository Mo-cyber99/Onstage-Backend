import { 
    BadRequestException,
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
} from "@nestjs/common";
import { isURL, IsUrl } from "class-validator";
import mongoose from "mongoose";
import { whiteListValidation } from "../validator";

import { CreateUserDto, UpdateUserDto } from "./create-user.dto";

import { UsersService } from "./users.service";

@Controller('/api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

@Get()
async getUsers() {
    const users = await this.usersService.getUsers();
    return { users };
}
@Get(':id')
async getUserById(@Param() { id }) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException("Invalid User ID");
    }
    const user = await this.usersService.getUserById(id);
    if (!user) {
        throw new NotFoundException("User ID not found");
    }
    return { user };
}
@Get('/login/:email')
async getUserByEmail(@Param() { email }) {
    if (!isURL(email)) {
        throw new BadRequestException("Invalid User Email");
    }
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
        throw new NotFoundException("User email not found");
    }
    return { user };
}
@Post()
async createNewUser(@Body(whiteListValidation) CreateUserDto: CreateUserDto) {
    if (!CreateUserDto.email || !CreateUserDto.username) {
        throw new BadRequestException('Missing required data')
    }
    const newUser = await this.usersService.create(CreateUserDto);
    return { newUser };
}
@Patch(':id')
async updateUserProfile(
    @Param() { id },
    @Body(whiteListValidation)
    UpdateUserDto: UpdateUserDto,
) {
    const updatedUser = await this.usersService.updateUserProfile(
        id,
        UpdateUserDto,
    );
    
    return { updatedUser };
}
}