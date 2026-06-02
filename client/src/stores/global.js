import { defineStore } from 'pinia';
import { reactive } from 'vue';

import api from '../api.js';

export const useGlobalStore = defineStore('global', () => {

	let user = reactive({
		id: localStorage.getItem('userId'),
		token: localStorage.getItem('token'),
		email: null,
		firstName: null,
		lastName: null,
		isAdmin: null
	})

	async function getUserDetails(token) {
		
		if(!token) {
			user.id = null;
			user.token = null;
			user.email = null;
			user.firstName = null;
			user.lastName = null;
			user.isAdmin = null;

			localStorage.removeItem('userId');
			return
		}

		let { data } = await api.get('/users/details', {
			headers: {
				Authorization: `Bearer ${token}`
			}
		})

		user.id = data._id;
		user.token = token;
		user.email = data.email;
		user.firstName = data.firstName;
		user.lastName = data.lastName;
		user.isAdmin = data.isAdmin;

		localStorage.setItem('userId', data._id);
	}

	return {
		user,
		getUserDetails
	}
});