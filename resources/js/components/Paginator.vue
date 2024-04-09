<template>
    <ul class="pagination justify-content-center">
        <li class="page-item">
            <button
                class="page-link"
                :class="{disabled: isInFirstPage}"
                role="menuitem"
                aria-label="Go to the first page"
                @click="loadPage(1)"
            >
                Eerste
            </button>
        </li>

        <li class="page-item">
            <button
                class="page-link"
                :class="{disabled: isInFirstPage}"
                role="menuitem"
                aria-label="Go to previous page"
                @click="loadPage(props.currentPage - 1)"
            >
                Vorige
            </button>
        </li>

        <li v-for="page in pages" :key="page" class="pagination-item">
            <button
                class="page-link"
                role="menuitem"
                :disabled="page.isDisabled"
                :class="{active: isPageActive(page.name)}"
                @click="loadPage(page.name)"
            >
                {{ page.name }}
            </button>
        </li>

        <li class="page-item">
            <button
                class="page-link"
                role="menuitem"
                aria-label="Go to previous page"
                :class="{disabled: isInLastPage}"
                @click="loadPage(props.currentPage + 1)"
            >
                Volgende
            </button>
        </li>

        <li class="page-item">
            <button
                class="page-link"
                :class="{disabled: isInLastPage}"
                role="menuitem"
                aria-label="Go to the last page"
                @click="loadPage(lastPage)"
            >
                Laatste
            </button>
        </li>
    </ul>
</template>

<script setup>
import {computed} from 'vue';

const emit = defineEmits(['pageChanged']);

const props = defineProps({
    maxVisibleButtons: {
        type: Number,
        required: false,
        default: 3,
    },
    currentPage: {
        type: Number,
        required: true,
    },
    lastPage: {
        type: Number,
        required: true,
    },
    perPage: {
        type: Number,
        required: true,
    },
});

const startPage = computed(() => {
    // When on the first page
    if (props.currentPage === 1) return 1;

    // When on the last page
    if (props.currentPage === props.lastPage) return props.lastPage - props.maxVisibleButtons;

    // When inbetween
    return props.currentPage - 1;
});

const pages = computed(() => {
    const range = [];

    for (let i = startPage.value; i <= Math.min(startPage.value + props.maxVisibleButtons, props.lastPage); i++) {
        range.push({
            name: i,
            isDisabled: i === props.currentPage,
        });
    }

    return range;
});

const isInFirstPage = computed(() => props.currentPage === 1);

const isInLastPage = computed(() => props.currentPage === props.lastPage);

const loadPage = function loadPage(page) {
    emit('pageChanged', page);
};

const isPageActive = function (page) {
    return props.currentPage === page;
};
</script>
