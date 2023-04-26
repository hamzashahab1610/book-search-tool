import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("fetches books when search button is clicked", async () => {
	render(<App />);

	const searchInput = screen.getByPlaceholderText("Enter name of the book");
	fireEvent.change(searchInput, { target: { value: "React" } });

	const searchButton = screen.getByText("Search");
	fireEvent.click(searchButton);

	const loadingGif = screen.getByTestId("loading-gif");
	expect(loadingGif).toBeInTheDocument();

	const bookTable = await screen.findByTestId("book-table");
	expect(bookTable).toBeInTheDocument();

	const bookRows = screen.getAllByTestId("book-row");
	expect(bookRows.length).toBeGreaterThan(0);
});
