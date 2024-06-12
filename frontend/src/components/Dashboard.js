import React, { useState } from "react";
import { Link } from 'react-router-dom';
import checkImage from '../assets/img/check.jpg';
import aiicon from '../assets/img/ai2.png';
import Header from "./Header";
import loaderimage from '../assets/img/loader.gif';
import useDashboard from "../hooks/useDashboard";
import { handleHighlightParagraph, handleDropdownChange, handleSearchHistory, handleSearch } from "../functions/Dashboardfunctions"; 

const Dashboard = () => {
    const { searchHistory, setSearchHistory, htmlData, setHtmlData, editedIds, setEditedIds, searchResults, setSearchResults, dropdownOptions, setDropdownOptions } = useDashboard();
    const [selectedParagraphId, setSelectedParagraphId] = useState(null);
    const [errMsg, setErrMsg] = useState('');
    const [isDropdownChanged, setDropdownChanged] = useState(false);
    const user = localStorage.getItem('user');
    const staticValues = ["Cited", "Considered", "Applied", "Distinguished", "Followed", "Not followed", "Overruled"];
    const [previousPara, setPreviousPara] = useState(null);
    let progressindicator =  document.getElementById('progressIndicator');
    let overlay = document.getElementById('overlay');

    return (
        <>
            <Header user={user} setSearchResults={setSearchResults} setDropdownOptions={setDropdownOptions} setErrMsg={setErrMsg}/>
            <div className="d-flex justify-content-center search-container">
                <form
                    className="SS_SearchForm"
                    onSubmit={(e) => handleSearch(e, progressindicator, overlay, setSearchResults, staticValues, setDropdownOptions, setErrMsg, setHtmlData)}>
                    <div className="input-group">
                        <input
                            type="search"
                            className="form-control rounded"
                            placeholder="Search with citation"
                            aria-label="Search"
                            aria-describedby="search-addon"
                            name="search_query"
                            id="search_query"
                            required
                            list="search_history"
                            onChange={(e) => handleSearchHistory(e, setSearchHistory)}
                        />
                        <datalist id="search_history">
                            {searchHistory.map((item, index) => (
                                <option key={index} value={item} />
                            ))}
                        </datalist>
                        <button
                            type="submit"
                            id="searchButton"
                            className="btn btn-outline-primary"
                            data-mdb-ripple-init>
                            search
                        </button>
                    </div>
                </form>
            </div>
            {searchResults.length > 0 && htmlData ? (
                <>
                    <div className="flex-container">
                        <div id="left-panel">
                            {<div dangerouslySetInnerHTML={{ __html: htmlData }} />}
                        </div>
                        <div id="right-panel">
                            <div class="annotheadarea">
                                <h2>Annotations</h2>
                                <button type="button" class="btn btn-sm btn-danger">Send to CBHK</button>
                            </div>
                            <hr />
                            <div className="annotation-list">
                                {searchResults.map((result, index) => (
                                    <div className="annotation-box">
                                        <Link
                                            to="#"
                                            onClick={(e) => handleHighlightParagraph(e, result.para_no, previousPara, setPreviousPara)}
                                            key={result.id}>
                                            <div className="annotation-item-grp" refid="A001">
                                                <div className="para-no badge">{result.para_no}</div>
                                                <div className="annotation-cita">{result.litigants}</div>
                                                <div className="ai-predictioninfo" role="alert"><img src={aiicon} alt="" srcset="" className="aiicon" /><span className="annotation-text">{result.AI_annotation_para}</span></div>
                                            </div>
                                        </Link>
                                        <div className="annotation-buttons">
                                            <select className="form-select" aria-label="Default select example" onChange={(event) => handleDropdownChange(event, result.id, setDropdownChanged, setSelectedParagraphId, setEditedIds)}>
                                                {dropdownOptions.map((option, index) => (
                                                    <React.Fragment key={index}>
                                                        <option value={option} selected={result.SME_Annotation_para === option}>
                                                            {option}
                                                        </option>
                                                    </React.Fragment>
                                                ))}
                                            </select> &nbsp;{editedIds.includes(result.id) || (isDropdownChanged && selectedParagraphId === result.id) ? <img src={checkImage} alt="Edited" className="edited-icon" /> : ''}
                                        </div>



                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </>
            ) : (errMsg ? <div class="alert alert-info" role="alert">
                No record found!
            </div> : '')
            }
            <div id="overlay"></div>
            <div id="progressIndicator">
                <img src={loaderimage} alt="Loading..." />
            </div>
        </>
    )
}
export default Dashboard;
