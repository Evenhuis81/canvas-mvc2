/* eslint-disable import/no-duplicates */

<template>
    <div class="container-fluid content">
        <h1>Registraties</h1>
        <div class="row">
            <div class="col-12">
                <div class="bg-light p-3 mb-3 d-flex align-items-center">
                    <div class="me-3"><strong>Filters</strong></div>

                    <div class="form-floating">
                        <input id="nameFilter" v-model="searchTerm" type="search" class="form-control" />
                        <span id="searchclear" class="glyphicon glyphicon-remove-circle" />
                        <label for="nameFilter">Naam</label>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <date-paginator
                    v-model="currentDate"
                    class="pagination justify-content-center mb-5"
                    @click="fetchTagScansByWeek"
                />

                <div v-if="Object.keys(tagScanData).length === 0">Er zijn geen tagscans voor deze week</div>

                <div v-for="(tagScans, index) in tagScanData" v-else id="my-div" :key="index" class="card mb-5">
                    <div class="card-body">
                        <h5 class="card-title">
                            {{
                                format(new Date(index), 'PPPP', {
                                    locale: nl,
                                })
                            }}
                        </h5>

                        <table class="tagScanTable">
                            <thead>
                                <tr>
                                    <th class="col-1">Naam</th>
                                    <th class="col-1">Check in</th>
                                    <th class="col-1">Check out</th>
                                    <th class="col-1" />
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(tagScan, index_) in tagScans" :key="index_">
                                    <td class="col-1">
                                        {{ tagScan.full_name }}
                                    </td>

                                    <td class="col-1">
                                        <div
                                            v-if="editingTagScanId === tagScan.id"
                                            class="input-group input-group-sm edit-input"
                                        >
                                            <input
                                                v-model="tagScan.check_in_time"
                                                type="time"
                                                class="form-control display-inline"
                                                :class="{
                                                    'is-invalid':
                                                        errorStore.errors.value.hasOwnProperty('check_in_time'),
                                                }"
                                            />
                                            <span class="input-group-text">uur</span>
                                            <a class="btn btn-danger rounded ms-2" @click="resetCheckInTime(tagScan)">
                                                <i class="bi bi-trash" />
                                            </a>
                                            <div
                                                v-if="errorStore.errors.value.hasOwnProperty('check_in_time')"
                                                class="invalid-feedback"
                                            >
                                                {{ errorStore.errors.value.check_in_time.join(' ') }}
                                            </div>
                                        </div>
                                        <div v-else>
                                            {{ tagScan.check_in_time }}
                                        </div>
                                    </td>

                                    <td class="col-1">
                                        <div
                                            v-if="editingTagScanId === tagScan.id"
                                            class="input-group input-group-sm edit-input"
                                        >
                                            <input
                                                v-model="tagScan.check_out_time"
                                                type="time"
                                                class="form-control display-inline"
                                                :class="{
                                                    'is-invalid':
                                                        errorStore.errors.value.hasOwnProperty('check_out_time'),
                                                }"
                                            />
                                            <span class="input-group-text">uur</span>
                                            <a class="btn btn-danger rounded ms-2" @click="resetCheckOutTime(tagScan)">
                                                <i class="bi bi-trash" />
                                            </a>
                                            <div
                                                v-if="errorStore.errors.value.hasOwnProperty('check_out_time')"
                                                class="invalid-feedback"
                                            >
                                                {{ errorStore.errors.value.check_out_time.join(' ') }}
                                            </div>
                                        </div>
                                        <div v-else>
                                            {{ tagScan.check_out_time }}
                                        </div>
                                    </td>
                                    <td class="col-1" />

                                    <td class="col-1">
                                        <div v-if="editingTagScanId === tagScan.id">
                                            <button
                                                type="button"
                                                class="btn btn-primary btn-sm opacity-100"
                                                title="Opslaan"
                                                @click="handleSubmit(tagScan)"
                                            >
                                                Opslaan
                                            </button>
                                            <button
                                                type="button"
                                                class="btn btn-light btn-sm opacity-100"
                                                title="Bewerken annuleren"
                                                @click="editRowHandler(tagScan)"
                                            >
                                                Annuleren
                                            </button>
                                        </div>
                                        <div v-else>
                                            <button
                                                class="btn btn-secondary btn-sm"
                                                title="Bewerken"
                                                @click="editRowHandler(tagScan)"
                                            >
                                                <span class="bi bi-arrow-up-right-circle">Bewerken</span>
                                            </button>
                                            <button
                                                class="btn btn-danger btn-sm"
                                                title="Verwijderen"
                                                @click="deleteTagScan(tagScan)"
                                            >
                                                <i class="bi bi-trash" />
                                                Verwijderen
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {onBeforeMount, ref, watchEffect} from 'vue';
import {tagScanStore} from 'store/tagScans.js';
import {useToast} from 'vue-toastification';
import DatePaginator from 'components/DatePaginator.vue';
// eslint-disable-next-line import/no-duplicates
import {format, setDay} from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import {nl} from 'date-fns/locale';

import useErrorStore from 'store/errors.js';

const errorStore = useErrorStore();

const currentDate = ref(setDay(new Date(), 1)); // set to monday of current week
const searchTerm = ref('');

const editingTagScanId = ref(0);
const tagScanBeforeEdit = ref();
const tagScanData = ref();

const fetchTagScansByWeek = async () => {
    try {
        await tagScanStore.actions.getAllByWeek(format(new Date(currentDate.value), 'yyyyMMdd'));
    } catch (error) {
        /* empty */
    }
};

const tagScansByWeekFiltered = tagScans => {
    let result = tagScans.map(item => ({
        ...item,
    }));

    if (searchTerm.value.length > 0) {
        let searchKeywords = searchTerm.value.toLowerCase().split(',');
        searchKeywords = searchKeywords.map(item => item.trim()).filter(item => item);
        result = result.filter(tagScan =>
            searchKeywords.some(keyWord => tagScan.full_name.toLowerCase().includes(keyWord)),
        );
    }

    result = result.reduce((accum, currentVal) => {
        const key = currentVal.check_in_datetime?.split(' ')[0];
        (accum[key] = accum[key] || []).push(currentVal);

        return accum;
    }, {});

    return result;
};

watchEffect(() => {
    tagScanData.value = tagScansByWeekFiltered(tagScanStore.getters.all.value);
});

const handleSubmit = async tagScan => {
    const toast = useToast();

    try {
        await tagScanStore.actions.update(tagScan.id, tagScan);
        editingTagScanId.value = 0;
        toast.success('Het bewerken van de registratie is gelukt', {
            timeout: 2000,
        });
    } catch (error) {
        toast.error('Het bewerken van de registratie is niet gelukt', {
            timeout: 2000,
        });
    }
};

const editRowHandler = tagScan => {
    if (editingTagScanId.value === 0) {
        tagScanBeforeEdit.value = {...tagScan}; // deepcopy
        editingTagScanId.value = tagScan.id;
    } else if (editingTagScanId.value === tagScan.id) {
        tagScan.check_in_time = tagScanBeforeEdit.value.check_in_time;
        tagScan.check_out_time = tagScanBeforeEdit.value.check_out_time;
        editingTagScanId.value = 0;
        errorStore.clear();
    }
};

const deleteTagScan = async tagScan => {
    const toast = useToast();

    try {
        await tagScanStore.actions.delete(tagScan.id);
    } catch (error) {
        toast.error('Het verwijderen van de registratie is niet gelukt', {
            timeout: 2000,
        });
    }
};

const resetCheckOutTime = tagScan => {
    tagScan.check_out_time = '';
};

const resetCheckInTime = tagScan => {
    tagScan.check_in_time = '';
};

onBeforeMount(() => {
    fetchTagScansByWeek();
});
</script>

<style scoped>
tr {
    vertical-align: top;
}
.content {
    overflow-y: scroll;
}

.table > tbody > tr > th {
    width: 20%;
}

tr .actions .btn {
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
}

tr:hover .btn {
    opacity: 1;
}

.tagScanTable {
    width: 100%;
}
</style>
