import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { ContactRequestsService } from './contact-requests.service'
import { ApiTags } from '@nestjs/swagger'
import { ApiAuth, DocsInfo } from '@common/decorators'
import { CreateContactRequestDto, UpdateContactRequestStatusDto } from '@modules/contact-requests/contact-requests.dto'
import { IUserPayload } from '@common/interfaces'
import { CurrentUser } from '@modules/auth/decorators/user.decorator'
import { ContactRequestStatus } from '@common/enums'

@Controller('contacts')
@ApiTags('Contact Requests')
@ApiAuth()
export class ContactRequestsController {
  constructor(
    private readonly contactRequestsService: ContactRequestsService,
  ) {}

  @Post(':postId')
  @DocsInfo({ summary: 'Submit a contact request for a FOUND post' })
  async create(
    @Param('postId') postId: string,
    @Body() dto: CreateContactRequestDto,
    @CurrentUser() user: IUserPayload,
  ) {
    return this.contactRequestsService.create(postId, dto, user)
  }

  @Get('requests')
  @DocsInfo({ summary: 'Get all of my contact requests' })
  async findAll(
    @CurrentUser() user: IUserPayload,
    @Query('status') status?: ContactRequestStatus,
  ) {
    return this.contactRequestsService.findAll(user, status)
  }

  @Patch(':requestId')
  @DocsInfo({ summary: 'Update the status of a contact request' })
  async updateStatus(
    @Param('requestId') requestId: string,
    @Body() dto: UpdateContactRequestStatusDto,
    @CurrentUser() user: IUserPayload,
  ) {
    return this.contactRequestsService.updateStatus(requestId, dto, user)
  }
}
