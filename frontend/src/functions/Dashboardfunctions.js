import axios from "axios";
import instance from "../intercepter/intercepter";
const user = localStorage.getItem('user');

//function handle clear data when home link clicked
export const clearData = async (e, setSearchResults, setDropdownOptions) => {
    e.preventDefault();
    // Clear the data from localStorage
    setSearchResults('');
    setDropdownOptions('');
    localStorage.removeItem('results');
    localStorage.removeItem('dropdownOptions');
}

//function to handle logout 
export const handleLogout = async (e, setSearchResults, setErrMsg, navigate) => {
    e.preventDefault();
    axios.post('http://localhost:8081/logout', { username: JSON.parse(user) }).then((response) => {
        navigate('/');
        setSearchResults('');
        localStorage.removeItem('dropdownOptions');
        localStorage.removeItem('results');
        localStorage.removeItem('user');
        localStorage.removeItem('htmlData');
        localStorage.removeItem('token');
    }).catch(err => {
        if (!err?.response) {
            setErrMsg('No Server Response');
        } else if (err?.response?.status === 400) {
            setErrMsg('Missing Username or Password');
        } else if (err?.response?.status === 401) {
            setErrMsg('Unauthorized');
        }
    });
};

//function to highlight paragraph when any para clicked.
export const handleHighlightParagraph = (event, para_no, previousPara, setPreviousPara) => {
    event.preventDefault();
    const para = document.getElementById(para_no);
    if (para) {
        // If there was a previously highlighted paragraph, remove the background color and border
        if (previousPara) {
            previousPara.style.backgroundColor = "";
            previousPara.style.border = "";
            para.style.padding = "";
            para.style.borderRadius = "";
        }
        // Highlight the new paragraph
        para.style.backgroundColor = "aliceblue";
        para.style.border = "3px solid skyblue";
        para.style.padding = "5px 5px";
        para.style.borderRadius = "15px";
        para.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Update the previously highlighted paragraph
        setPreviousPara(para);
    }
}

//function for row, each dropdown value for each row if i change then it shiuld store on localstorage
export const handleDropdownChange = (event, paraid, setDropdownChanged, setSelectedParagraphId, setEditedIds) => {
    event.preventDefault();
    // Update dropdown values
    const smeValue = event.target.value;
    const paragraphid = paraid;
    //axios request to update the database by using smeValue and paragraphid
    instance.post('http://localhost:8081/updateannotation', { smeValue, paragraphid })
        .then((response) => {
            console.log(response);
            if (response.status === 200) {
                //make a state variable which should store paragraphid and false value
                setDropdownChanged(true);
                setSelectedParagraphId(paragraphid);
                if (response.data.flag === "True") {
                    setEditedIds(prevIds => {
                        const updatedIds = [...prevIds, paragraphid];
                        return updatedIds;
                    });
                }
                // Get existing results from localStorage
                const results = JSON.parse(localStorage.getItem('results')) || [];
                // Find the index of the record to update
                const recordIndex = results.findIndex(record => record.id === paragraphid);
                // Update the record
                if (recordIndex !== -1) {
                    results[recordIndex].SME_Annotation_para = smeValue;
                    // Store the updated results back in localStorage
                    localStorage.setItem('results', JSON.stringify(results));
                }
                console.log(response.data.message);
            } else {
                console.error('Update failed:', response);
            }
        }
        )
        .catch((error) => {
            console.log("Error in updating sme value", error);
        });
};

// Function to show progress before submitting data into database
function showProgressIndicator(progressindicator, overlay) {
    progressindicator.style.display = 'block';
    overlay.style.display = 'block';
}

function hideProgressIndicator(progressindicator, overlay) {
    progressindicator.style.display = 'none';
    overlay.style.display = 'none';
}

export const handleSearch = async (e, progressindicator, overlay, setSearchResults, staticValues, setDropdownOptions, setErrMsg, setHtmlData) => {
    e.preventDefault();
    showProgressIndicator(progressindicator, overlay);
    //Here sending request by using intercepter
    instance.post('http://localhost:8081/search', { query: e.target.elements.search_query.value }
    )
        .then((response) => {
            hideProgressIndicator(progressindicator, overlay);
            setSearchResults(response.data.results);
            const combinedValues = [...new Set([...response.data.uniqueSmeValues, ...staticValues])];
            setDropdownOptions(combinedValues.sort());
            localStorage.setItem('dropdownOptions', JSON.stringify(combinedValues.sort()));
            localStorage.setItem('results', JSON.stringify(response.data.results));
        })
        .catch((error) => {
            hideProgressIndicator();
            setSearchResults('');
            localStorage.removeItem('results');
            if (error.response.status === 404) {
                setErrMsg(error.response.data.message);
            } else if (error.response.status === 500) {
                setErrMsg(error.response.data.error);
            }
        });

    instance.post('http://localhost:8081/gethtmlfile', { file_citation: e.target.elements.search_query.value }
    ).then((response) => {
        // console.log(response.data);
        setHtmlData(response.data);
        localStorage.setItem('htmlData', response.data);
    })
        .catch((error) => {
            console.log("Error in fetching html data", error);
        });
};



//function to handle search history and store in localstorage
export const handleSearchHistory = (event, setSearchHistory) => {
    if (event.target.value !== "" && event.target.value !== null && event.target.value !== undefined) {
        // Update search history
        let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        // Remove the query if it already exists
        searchHistory = searchHistory.filter(item => item !== event.target.value);
        // Add the current query to the beginning of the array
        searchHistory.unshift(event.target.value);
        // Limit the search history to a certain number of items (e.g., 5)
        searchHistory = searchHistory.slice(0, 5);
        // Save updated search history to localStorage
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        setSearchHistory(Array.from(new Set([event.target.value, ...searchHistory])));
    }
};