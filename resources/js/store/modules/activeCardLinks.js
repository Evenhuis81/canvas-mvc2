import {computed, reactive} from 'vue';
import {withState} from '../helper.js';
import axios from 'axios';

// state
const state = reactive({
    activeCardLinks: [],
});

// getters
const getAll = computed(() => state.activeCardLinks);

const getLinkedCardLinks = computed(() => state.activeCardLinks.filter(cardLink => cardLink.is_linked === 1));

// actions
const setAll = async () => {
    const {data} = await axios.get('card_links');
    state.activeCardLinks = data.activeCardLinks;
};

const setOne = async card_link => {
    const {data} = await axios.get(`card_links/${card_link}`);
    state.activeCardLinks = [data.cardLink];
};

const createOne = async payload => {
    const {data} = await axios.post('card_links', payload);
    state.activeCardLinks = [data.activeCardLinks];

    return data.activeCardLinks;
};

export default () =>
    withState(
        {
            getAll,
            getLinkedCardLinks,
            setAll,
            setOne,
            createOne,
        },
        state,
    );
