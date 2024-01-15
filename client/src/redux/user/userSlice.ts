import {PayloadAction, createSlice} from '@reduxjs/toolkit'
import { User } from '../../types/userSlice'

interface InitStateType {
	currentUser : null | User,
error : null | string,
loading : boolean
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
		},


		signOutStart: (state) => {
			state.loading = true;
		},
		signOutSuccess: (state) => {
			state.error = null;
			state.currentUser = null
			state.loading = false
		},
		signOutFailed: (state, action:PayloadAction<string>) => {
			state.error = action.payload
			state.loading = false
		},


		updateUserStart: (state) => {
			state.loading = true;
		},
		updateUserSuccess: (state, action:PayloadAction<User>) => {
			state.error = null;
			state.currentUser = action.payload;
			state.loading = false
		},
		updateUserFailed: (state, action:PayloadAction<string>) => {
			state.error = action.payload;
			state.loading = false
		},


		deleteUserStart: (state) => {
			state.loading = true;
		},
		deleteUserSuccess: (state) => {
			state.error = null;
			state.currentUser = null
			state.loading = false
		},
		deleteUserFailed: (state, action:PayloadAction<string>) => {
			state.error = action.payload
			state.loading = false
		},

		
	},
})


export const {signInStart, signInFailure, signInSuccess, signOutStart, signOutSuccess, signOutFailed, updateUserStart, updateUserSuccess, updateUserFailed, deleteUserStart, deleteUserSuccess, deleteUserFailed} = userSlice.actions
export default userSlice.reducer