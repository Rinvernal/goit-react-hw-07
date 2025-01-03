import { createSelector, createSlice, isAnyOf } from "@reduxjs/toolkit"
import { fetchContacts, deleteContact, addContact } from "./contactsOps";
const initialState = {
  items: [],
  loading: false,
  error: false,
}
export const selectFilteredContacts = createSelector(
  [(state) => state.contacts.items, (state) => state.filter.name],
  (items, filter) => items.filter((item) => item.name.toLowerCase().includes(filter.toLowerCase()))
);
const slice = createSlice({
  name: 'contacts',
  initialState,
  extraReducers: (builder)=>{
    builder
      .addCase(fetchContacts.fulfilled, (state, action)=>{
      state.items = action.payload
      })
      .addCase(deleteContact.fulfilled, (state, action)=>{
        state.items = state.items.filter(item => item.id !== action.payload.id)
      })
      .addCase(addContact.fulfilled, (state, action)=>{
        state.items.push(action.payload)
      })
      .addMatcher(isAnyOf(addContact.pending, deleteContact.pending, fetchContacts.pending),
      (state)=>{
        state.error = false
        state.loading = true
      })
      .addMatcher(isAnyOf(addContact.rejected, deleteContact.rejected, fetchContacts.rejected),
      (state)=>{
        state.error = true
        state.loading = false
      })
      .addMatcher(isAnyOf(addContact.fulfilled, deleteContact.fulfilled, fetchContacts.fulfilled),
      (state)=>{
        state.error = false
        state.loading = false
      })
  }
})

export const selectContacts = state => state.contacts.items;
export const contactReducer = slice.reducer
///
export const selectIsError = state => state.contacts.error
export const selectIsLoading = state => state.contacts.loading