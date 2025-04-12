import { configureStore } from "@reduxjs/toolkit";

// Define an initial state
const initialState = {
  storedValues: [],
  totalAmount: 0,
};

// Create a reducer for budget data
const budgetReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_ENTRY":
      return {
        ...state,
        storedValues: [...state.storedValues, action.payload],
        totalAmount: state.totalAmount + action.payload.value,
      };
    case "DELETE_ENTRY":
      const entryToDelete = state.storedValues[action.payload];
      return {
        ...state,
        storedValues: state.storedValues.filter((_, i) => i !== action.payload),
        totalAmount: state.totalAmount - entryToDelete.value,
      };
    // Add more cases for transactions, etc., as needed
    default:
      return state;
  }
};

const store = configureStore({
  reducer: budgetReducer, // Use the budget reducer
});

export default store;