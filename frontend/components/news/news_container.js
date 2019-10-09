import { connect } from "react-redux";
import News from './news';
import{ getTopNews} from '../../actions/news_actions';

const msp = state => {
    return {
        news: state.entities.news
    }
}

const mdp = dispatch => {
    return {
        getTopNews: () => dispatch(getTopNews())
    }
}

export default connect(msp, mdp)(News);