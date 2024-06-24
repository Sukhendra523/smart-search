import React, { useEffect, useRef, useState } from 'react'
import { useCallback } from 'react';
import SuggestionList from '../SuggesionList';
import { useSearchParams } from 'react-router-dom';
import { debounce } from '../../utils';
import useSmartSearchCatch from './hooks/useSmartSearchCatch';

const SmartSearch = ({
    staticData,
    fetchData,
    dataKey,
    customLoading = "Loading .....",
    onChange,
    onFocus,
    onBlur,
    onSelect
}) => {
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const suggestionListRef = useRef(null);


    const [searchParam, setSearchParams] = useSearchParams();
    const queryParam = searchParam.get('q');

    const [getCache, setCache] = useSmartSearchCatch(3600);



    useEffect(() => {
        if (queryParam) {
            setInputValue(queryParam);
        }
    }, []);

    const fetchSuggestion = async (query) => {
        let searchResult;
        setLoading(true);
        try {
            const catchedSearch = getCache(query);
            if (catchedSearch) {
                searchResult = catchedSearch
            } else {
                if (staticData) {
                    searchResult = staticData.filter(data => data.toLowerCase().includes(query?.toLowerCase()))
                } else {
                    searchResult = await fetchData(query);
                }
            }
            if (searchResult) {
                setSuggestions(searchResult);
                setCache(query, searchResult)
            }
        } catch (error) {
            setError(`Sorry unable search Data, ${error.message || error.body.message || error}`);
        } finally {
            setLoading(false);
        }
    }

    const debouncedFetch = useCallback(debounce(fetchSuggestion, 300), []);



    useEffect(() => {
        if (inputValue.length > 1) {
            debouncedFetch(inputValue);
            onChange?.(inputValue)
        } else {
            setSuggestions([]);
        }
    }, [inputValue]);

    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);
        setSearchParams({ q: value });
    }

    const onSelectSuggestion = (suggestion) => {
        setInputValue(suggestion);
        onSelect?.(suggestion);
        setSuggestions([])
    }

    const scrollIntoView = (index) => {
        const listItems = suggestionListRef.current?.getElementsByTagName('li');
        if(listItems.length){
            listItems[index].scrollIntoView({
                behaviour:'smooth',
                block:"nearest"
            })
        }
    }

    const handleKeyDown = (event) => {
        switch (event.key) {
            case 'ArrowDown':
                setSelectedIndex((prevSelectedIndex)=>{ 
                    const newIndex = (prevSelectedIndex + 1) % suggestions.length;
                    scrollIntoView(newIndex);
                    return newIndex;
                })
                break;

            case 'ArrowUp':
                setSelectedIndex((prevSelectedIndex)=>{
                    const newIndex = (prevSelectedIndex - 1 + suggestions.length) % suggestions.length;
                    scrollIntoView(newIndex);
                    return newIndex;
                })
                break;

            case 'Enter':
                onSelectSuggestion(suggestions[selectedIndex][dataKey]);
                setSelectedIndex(-1);
                break;
            default:
                break;
        }
    }
    const onBlurHandler  = (event) => {
        setSuggestions([]);
        onBlur?.(event);
    }
    return (
        <div className='autocomplete-container'>
            <div>
                <input
                    className='autocomplete-input'
                    type="text"
                    onKeyDown={handleKeyDown}
                    onChange={handleInputChange}
                    value={inputValue}
                    onBlur={onBlurHandler}
                    onFocus={onFocus} 
                />
            </div>
            {(suggestions?.length > 0 || loading || error) &&
                <ul className='suggestions-list' ref={suggestionListRef}>
                    {error && <p className='error'>{error}</p>}
                    {loading && <span className='loading'> {customLoading} </span>}
                    <SuggestionList
                        dataKey={dataKey}
                        highlightText={inputValue}
                        suggestions={suggestions}
                        onSelectSuggestion={onSelectSuggestion}
                        selectedIndex={selectedIndex}
                    />
                </ul>
            }
        </div>
    )
}

export default SmartSearch