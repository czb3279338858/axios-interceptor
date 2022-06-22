import { initSelfAxios } from "./utils/initSelfAxios"
import { axiosUser } from "./request/axiosUser"
import { selfAxios } from "./selfAxios"

initSelfAxios(selfAxios)
const cs = async () => {
    await axiosUser()
    axiosUser()
}
cs()