import {PayloadAction, createSlice} from '@reduxjs/toolkit'

interface InitStateType {
	currentUser : null | User,
error : null | string,
loading : boolean
}

interface User {
	username : string, 
	photoURL : string,
	email : string
}

const initialState:InitStateType = {
currentUser : null,
error : null,
loading : false
}

const userSlice = createSlice({
	name:'UserReducer',
	initialState,
	reducers : {
		signInStart: (state) => {
			state.loading = true
		},
		signInSuccess: (state, action:PayloadAction<User>) => {
			state.currentUser = action.payload
			state.loading = false
			state.error = null
		},
		signInFailure: (state, action:PayloadAction<string>) => {
			state.error = action.payload
			state.loading = false
		}
	},
})


export const {signInStart, signInFailure, signInSuccess} = userSlice.actions
export default userSlice.reducer