import { Ability, AbilityBuilder } from '@casl/ability'
import { Role } from 'src/generated-sources/swagger-api'
import { Permission } from 'src/utils/permissions'

export type Subjects = string
export type Actions = string

export type AppAbility = Ability<[Actions, Subjects]> | undefined

export const AppAbility = Ability as any
export type ACLObj = {
  action: Actions
  subject: string
}

/**
 * Please define your own Ability rules according to your app requirements.
 * We have just shown Admin and Client rules for demo purpose where
 * admin can manage everything and client can just visit ACL page
 */
const defineRulesFor = (role: Role, companyAbilities: Array<string>, permissionsValue: string, subject: string) => {
  const { can, rules } = new AbilityBuilder(AppAbility)

  const permission = new Permission(BigInt(permissionsValue ?? '0'))
  const userAbilities = Object.entries(permission.iter())
    .filter(([key, value]) => value)
    .map(([key, value]) => key)

  can([...userAbilities, ...companyAbilities, 'read'], subject)

  return rules
}

export const buildAbilityFor = (
  role: Role,
  companyAbilities: Array<string>,
  permissionsValue: string,
  subject: string
): AppAbility => {
  return new AppAbility(defineRulesFor(role, companyAbilities, permissionsValue, subject), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: object => object!.type
  })
}

export const defaultACLObj: ACLObj = {
  action: 'read',
  subject: 'all'
}

export default defineRulesFor
