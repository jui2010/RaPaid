import {SET_AUTHENTICATED , LOADING_USER, SET_UNAUTHENTICATED, SET_AUTHENTICATED_USER} from '../types'
import axios from 'axios'

export const signupUser = (newUser, history) => (dispatch) => {
    axios.post('/users/signup', newUser)
        .then(res => {
            dispatch({
                type : SET_AUTHENTICATED
            })
            history.push('/login')
        })
        .catch(err => {
            console.log(err)
        })
}

export const loginUser = (newUser, history) => (dispatch) => {
    dispatch({
        type : LOADING_USER
    })
    axios.post('/users/login', newUser)
        .then(res => {

            //store the token on local machine, so if page refreshes.. user doesnt have to login again
            setAuthorizationHeader(res.data)
            dispatch({
                type : SET_AUTHENTICATED
            })
            dispatch(getAuthenticatedUserData())
            history.push('/home')
        })
        .catch(err => {
            console.log(err)
        })
}

const setAuthorizationHeader = (token) => {   
    const userToken = token
    //store the token on local machine, so if page refreshes.. user doesnt have to login again
    localStorage.setItem('userToken' , userToken )
    axios.defaults.headers.common['Authorization'] = userToken
}

export const logoutUser = () => (dispatch) => {
    localStorage.removeItem('userToken')
    delete axios.defaults.headers.common['Authorization']

    dispatch({
        type : SET_UNAUTHENTICATED
    })
}

//get the authenticated user data
export const getAuthenticatedUserData = () => (dispatch) => {
    axios.get('/user/getAuthenticatedUserData/')
    .then(res => {
        dispatch({
            type : SET_AUTHENTICATED_USER,
            payload : res.data
        })
    })
    .catch(err => console.log(err) )
}
