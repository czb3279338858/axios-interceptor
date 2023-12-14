import { selfAxios } from "./selfAxios"

export async function getCurrentUser() {
  const res = await selfAxios.get('https://apigatewayuat.oppein.com/ucenterapi/uc/internal/common/getCurrentUser', {
    params: {
      platformType: 'MTDS'
    },
    headers: {
      'Oauth2-Accesstoken': '9fdd1acc9b57eec443eb7042625cb893u',
      Appcode: 'MTDS',
      Subappcode: 'MTDSPC001'
    },
    _cache: true
  })
  return res
}