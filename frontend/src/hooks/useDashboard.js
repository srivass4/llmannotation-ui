import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import instance from "../intercepter/intercepter";

const useDashboard = () => {
    const navigate = useNavigate();
    const [searchHistory, setSearchHistory] = useState([]);
    const [htmlData, setHtmlData] = useState([]);
    const [editedIds, setEditedIds] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [dropdownOptions, setDropdownOptions] = useState([]);
    //get user
    useEffect(() => {
        const auth = localStorage.getItem('token');
        if (auth) {
            navigate('/landingannot');
        }
    }, [navigate]);

    // Load search history from localStorage when the component mounts
    useEffect(() => {
        const loadedSearchHistory = localStorage.getItem('searchHistory');
        if (loadedSearchHistory) {
            setSearchHistory(JSON.parse(loadedSearchHistory));
        }
    }, []);

    // Load html data from localstorage
    useEffect(() => {
        const html = localStorage.getItem('htmlData');
        // console.log("Hello", html);
        if (html) {
            setHtmlData(html);
        }
    }, []);

    // fetching the flag status from server when the component mounts
    useEffect(() => {
        getEditedStatus();
    }, []);

    function getEditedStatus() {
        instance.get('http://localhost:8081/getEditedStatus')
            .then((response) => {
                const editedIds = response.data.map(record => record.id);
                setEditedIds(editedIds);
            })
            .catch((error) => {
                console.error('Error fetching edited status:', error);
            });
    }

    //fetching the results from localstorage when component mounts
    useEffect(() => {
        // Get the results from localStorage
        const storedResults = localStorage.getItem('results');
        if (storedResults) {
            setSearchResults(JSON.parse(storedResults));
            // Get the dropdown options from localStorage
            const storedDropdownOptions = localStorage.getItem('dropdownOptions');
            if (storedDropdownOptions) {
                setDropdownOptions(JSON.parse(storedDropdownOptions));
            }
        }
    }, []);

    return {
        searchHistory,
        setSearchHistory,
        htmlData,
        setHtmlData,
        editedIds,
        setEditedIds,
        searchResults,
        setSearchResults,
        dropdownOptions,
        setDropdownOptions
    };
}

export default useDashboard;
