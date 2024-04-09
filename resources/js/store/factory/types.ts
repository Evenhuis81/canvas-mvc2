import {Ref} from 'vue';

export type State<T extends { id: number }> = Ref<Map<number, T>>;

export type New<T extends { id: number }> = Omit<T, 'id'>;

export type Updatable<T extends { id: number }> = New<T> & {
    id?: number;
};
