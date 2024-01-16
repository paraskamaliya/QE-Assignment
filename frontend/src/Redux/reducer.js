import { LOGIN, LOGOUT } from "./actionType"

const initState = {
    isAuth: false,
    token: "",
    user: {}
}
const AuthReducer = (state = initState, { type, payload }) => {
    switch (type) {
        case LOGIN: {
            return { ...state, isAuth: true, token: payload.token, user: payload.user }
        }
        case LOGOUT: {
            return { ...state, isAuth: false, token: "", user: {} }
        }
        default: {
            return state
        }
    }
}
export default AuthReducer;