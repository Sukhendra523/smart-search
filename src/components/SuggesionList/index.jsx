import React from 'react'

const SuggestionList = ({ suggestions = [], highlightText, dataKey, onSelectSuggestion , selectedIndex}) => {

    const getHighLightedText = (suggestion) => {
        const textArray = suggestion.split(new RegExp(`(${highlightText})`, 'gi'));
        return <span> {textArray.map((text,i) => text.toLowerCase() === highlightText.toLowerCase() ? <b key={i}>{text}</b> : text)} </span>;
    }

    return (

        <>
            {suggestions.map((suggestion, i) => {
                const currentSuggestion = dataKey ? suggestion[dataKey] : suggestion;
                return <li 
                key={currentSuggestion + i} 
                className='suggestion-item' 
                onClick={() => onSelectSuggestion(currentSuggestion)}
                aria-selected={selectedIndex===i}
                >
                    {getHighLightedText(currentSuggestion)}
                    </li>
            }
            )}
        </>
    )
}

export default SuggestionList