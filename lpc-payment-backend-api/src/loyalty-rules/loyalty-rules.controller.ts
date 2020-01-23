import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Query,
  Param,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { SearchRulesReq, PostOrPutRuleReq, PatchRuleReq } from './models';
import { PageDto } from '../utils/utils.dto';
import { Rule } from '../entities';
import { AdminGuard } from '../guard/admin.guard';
import { ParseIntPipe } from '../pipe/parse-int.pipe';
import { LoyaltyRulesService } from './loyalty-rules.service';

/**
 * Endpoints for loyalty rule
 */
@Controller('loyalty/rules')
@UseGuards(AdminGuard)
export class LoyaltyRulesController {
  constructor(private readonly loyaltyRulesService: LoyaltyRulesService) {}

  /**
   * Gets a list of loyalty rules.
   *
   * @param searchRulesReq search rule request
   *
   * @returns loyalty rule data with pagination info
   */
  @Get()
  searchRules(
    @Query() searchRulesReq: SearchRulesReq,
  ): Promise<PageDto<Rule[]>> {
    return this.loyaltyRulesService.searchRules(searchRulesReq);
  }

  /**
   * Create a loyalty rule.
   *
   * @param createRuleReq create loyalty rule info
   *
   * @returns the loyalty rule to be created
   */
  @Post()
  create(@Body() createRuleReq: PostOrPutRuleReq): Promise<Rule> {
    return this.loyaltyRulesService.create(createRuleReq);
  }

  /**
   * Get loyalty rule by id.
   *
   * @param ruleId the rule id
   *
   * @returns the loyalty rule with given id
   */
  @Get(':ruleId')
  get(@Param('ruleId', new ParseIntPipe()) ruleId: number): Promise<Rule> {
    return this.loyaltyRulesService.get(ruleId, true);
  }

  /**
   * Fully update loyalty rule by id.
   *
   * @param ruleId the rule id
   * @param updateRuleReq update loyalty rule info
   *
   * @returns the loyalty rule to be updated
   */
  @Put(':ruleId')
  put(
    @Param('ruleId', new ParseIntPipe()) ruleId: number,
    @Body() updateRuleReq: PostOrPutRuleReq,
  ): Promise<Rule> {
    return this.loyaltyRulesService.put(ruleId, updateRuleReq);
  }

  /**
   * Partially update loyalty rule by id.
   *
   * @param ruleId the rule id
   * @param patchRuleReq update loyalty rule info
   *
   * @returns the loyalty rule to be updated
   */
  @Patch(':ruleId')
  patch(
    @Param('ruleId', new ParseIntPipe()) ruleId: number,
    @Body() patchRuleReq: PatchRuleReq,
  ): Promise<Rule> {
    return this.loyaltyRulesService.patch(ruleId, patchRuleReq);
  }

  /**
   * Delete loyalty rule by id.
   *
   * @param ruleId the rule id
   */
  @Delete(':ruleId')
  @HttpCode(204)
  delete(@Param('ruleId', new ParseIntPipe()) ruleId: number): Promise<void> {
    return this.loyaltyRulesService.delete(ruleId);
  }
}
