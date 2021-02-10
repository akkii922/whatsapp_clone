import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './SearchPeople.scss';

const SearchPeople = () => {
    return (
        <div className="search">
            <FontAwesomeIcon className="icon-block" icon={faSearch} />
            <input placeholder="search" />
        </div>
    )
}

export default SearchPeople;