<template>
    <div>
        <ul
            role="menubar"
            aria-disabled="false"
            aria-label="Pagination"
            class="pagination pagination justify-content-center mb-5 b-pagination"
        >
            <li role="presentation" aria-hidden="true" class="page-item">
                <button
                    role="menuitem"
                    type="button"
                    tabindex="-1"
                    aria-label="Go to previous page"
                    class="page-link"
                    @click="toPage(-1)"
                >
                    Vorige
                </button>
            </li>

            <li
                v-for="(weekObject, index_) in week"
                :key="index_"
                role="presentation"
                class="page-item"
                :class="{
                    active: isActive(weekObject.date),
                    disabled: weekObject.future,
                }"
            >
                <button
                    role="menuitemradio"
                    type="button"
                    aria-controls="my-div"
                    aria-label="Go to page 1"
                    aria-checked="true"
                    aria-posinset="1"
                    aria-setsize="1"
                    tabindex="0"
                    class="page-link"
                    @click="toPage(weekObject.index)"
                >
                    <a>Week {{ `${weekObject.weekNum} ${weekObject.year}` }}</a>
                </button>
            </li>

            <li
                role="presentation"
                aria-hidden="true"
                class="page-item"
                :class="{
                    disabled: nextWeekButtonDisabled,
                }"
            >
                <button
                    role="menuitem"
                    type="button"
                    tabindex="-1"
                    aria-label="Go to previous page"
                    class="page-link"
                    @click="toPage(1)"
                >
                    Volgende
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup>
import {add, getWeek, getYear, isFuture} from 'date-fns';
import {computed, ref} from 'vue';

const numPageButtons = ref(5);

const emit = defineEmits(['update:modelValue']);
const props = defineProps({
    modelValue: {
        type: Date,
        required: true,
    },
});

const week = computed(() => {
    const weekArr = [];
    const offset = Math.floor(numPageButtons.value / 2);

    for (let i = 0; i < numPageButtons.value; i++) {
        const index = i - offset;
        const date = add(props.modelValue, {weeks: i - offset});
        const future = isFuture(date);
        const weekNum = getWeekNum(date);
        const year = getYear(date);
        weekArr.push({index, date, future, weekNum, year});
    }

    return weekArr;
});

const currentWeek = computed(() => getWeek(new Date()));

const activeWeek = computed(() => getWeek(props.modelValue));

const nextWeekButtonDisabled = computed(() => currentWeek.value === activeWeek.value);

const toPage = pageOffset => {
    emit('update:modelValue', add(props.modelValue, {weeks: pageOffset}));
};

const getWeekNum = date =>
    getWeek(date, {
        weekStartsOn: 1,
        firstWeekContainsDate: 4,
    });

const isActive = date => activeWeek.value === getWeek(date);
</script>
