import React from 'react';
import "./Pagination.css";

const Pagination = ({ totalPosts, postsPerPage, setCurrentPage, currentPage }) => {
    const [currentSlice, setCurrentSlice] = React.useState(0);
    const pages = [];

    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pages.push(i);
    }

    const pagesToShow = pages.slice(currentSlice, currentSlice + 3);

    const nextSlice = () => {
        if (currentSlice + 3 < pages.length) {
            setCurrentSlice(currentSlice + 1);
        }
    };

    const prevSlice = () => {
        if (currentSlice > 0) {
            setCurrentSlice(currentSlice - 1);
        }
    };

    return (
        <div className="pagination">
            <button 
                className="arrow" 
                onClick={prevSlice} 
                disabled={currentSlice === 0}
            >
                &lt;
            </button>
            {pagesToShow.map((page, index) => (
                <button
                    key={index}
                    onClick={() => setCurrentPage(page)}
                    className={page === currentPage ? 'active' : ''}
                >
                    {page}
                </button>
            ))}
            <button 
                className="arrow" 
                onClick={nextSlice} 
                disabled={currentSlice + 3 >= pages.length}
            >
                &gt;
            </button>
        </div>
    );
}

export default Pagination;
