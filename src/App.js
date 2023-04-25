import { useState } from "react";
import loadingGif from "./assets/loading.gif";
import "./App.css";

function App() {
	const [bookResult, setBookResult] = useState(null);
	const [sortedBy, setSortedBy] = useState(null);
	const [sortOrder, setSortOrder] = useState("asc");
	const [currentPage, setCurrentPage] = useState(1);
	const booksPerPage = 10;
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(false);

	const totalPages = Math.ceil(bookResult?.length / booksPerPage);
	const pageNumbers = [];

	for (let i = 1; i <= totalPages; i++) {
		pageNumbers.push(i);
	}

	const handleSort = (key) => {
		if (key === sortedBy) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			setSortedBy(key);
			setSortOrder("asc");
		}
	};

	const handlePageClick = (e) => {
		setCurrentPage(Number(e.target.id));
	};

	const getBooksToShow = () => {
		let sortedBooks = bookResult;
		if (sortedBy) {
			sortedBooks = bookResult.sort((a, b) => {
				if (a[sortedBy] < b[sortedBy]) {
					return sortOrder === "asc" ? -1 : 1;
				}
				if (a[sortedBy] > b[sortedBy]) {
					return sortOrder === "asc" ? 1 : -1;
				}
				return 0;
			});
		}

		const lastBookIndex = currentPage * booksPerPage;
		const firstBookIndex = lastBookIndex - booksPerPage;
		const booksToShow = sortedBooks?.slice(firstBookIndex, lastBookIndex);
		return booksToShow;
	};

	const fetchBookResult = () => {
		setLoading(true);
		fetch(`http://openlibrary.org/search.json?q=${searchTerm}`)
			.then((res) => res.json())
			.then((data) => {
				const books =
					data &&
					data?.docs?.map((book) => {
						return {
							title: book?.title,
							publish_date:
								book?.publish_date?.length > 0 &&
								book?.publish_date[0],
							author_name:
								book?.author_name?.length > 0 &&
								book?.author_name[0],
							cover:
								book?.isbn?.length > 0 &&
								`https://covers.openlibrary.org/b/isbn/${book?.isbn[0]}-S.jpg`
						};
					});
				setBookResult(books);
				setLoading(false);
			});
	};

	const getTableHeader = () => {
		const headerLabels = ["Title", "Cover", "Author Name", "Publish Date"];
		return (
			<thead>
				<tr>
					{headerLabels.map((label) => (
						<th
							key={label}
							onClick={() =>
								handleSort(
									label.toLowerCase().replace(" ", "_")
								)
							}
						>
							{label}
							{sortedBy ===
							label.toLowerCase().replace(" ", "_") ? (
								sortOrder === "asc" ? (
									<span style={{ marginLeft: "0.5rem" }}>
										&#9660;
									</span>
								) : (
									<span style={{ marginLeft: "0.5rem" }}>
										&#9650;
									</span>
								)
							) : (
								<span style={{ marginLeft: "0.5rem" }}>-</span>
							)}
						</th>
					))}
				</tr>
			</thead>
		);
	};

	const getTableRows = () => {
		return (
			<tbody>
				{getBooksToShow()?.map((book, idx) => {
					const { title, cover, author_name, publish_date } = book;
					return (
						<tr key={idx}>
							<td>{title}</td>
							<td>
								{cover ? (
									<img src={cover} alt={title} />
								) : (
									<span>No image available</span>
								)}
							</td>
							<td>{author_name ? author_name : "-"}</td>
							<td>{publish_date ? publish_date : "-"}</td>
						</tr>
					);
				})}
			</tbody>
		);
	};

	return (
		<div className="container">
			<h1 className="title">Book Search Tool</h1>

			<div className="input-container">
				<input
					type="text"
					onChange={(e) => setSearchTerm(e.target.value)}
					placeholder="Enter name of the book"
					className="search-input"
				/>
				<button
					className="search-button"
					onClick={fetchBookResult}
					type="submit"
				>
					Search
				</button>
			</div>

			{(getBooksToShow()?.length > 0 && !loading && (
				<div className="table-container">
					<table>
						<colgroup>
							<col span="1" style={{ width: "30%" }} />
							<col span="1" style={{ width: "20%" }} />
							<col span="1" style={{ width: "25%" }} />
							<col span="1" style={{ width: "25%" }} />
						</colgroup>
						{getTableHeader()}
						{getTableRows()}
					</table>
					<div className="pagination-container">
						<ul className="pagination">
							{pageNumbers.map((number) => {
								return (
									<li
										key={number}
										id={number}
										onClick={handlePageClick}
										className={
											currentPage === number
												? "active"
												: null
										}
									>
										{number}
									</li>
								);
							})}
						</ul>
					</div>
				</div>
			)) ||
				(loading && (
					<div className="loading-container">
						<h1>Loading...</h1>
						<img
							className="loading-gif"
							src={loadingGif}
							alt="loading"
						/>
					</div>
				))}
		</div>
	);
}

export default App;
