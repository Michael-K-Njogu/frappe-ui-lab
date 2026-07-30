import { computed } from 'vue'
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from '@lucide/vue'

const DEFAULT_SORT_DIRECTIONS = {
    name: 'asc',
    email: 'asc',
    customerType: 'asc',
    creditLimit: 'asc',
    createdAt: 'desc',
}

export function useSorting(sort) {
    function sortBy(field) {
        if (sort.field === field) {
            sort.direction = 
                sort.direction === 'asc' 
                    ? 'desc' 
                    : 'asc'
        } else {
            sort.field = field
            sort.direction = 
                DEFAULT_SORT_DIRECTIONS[field] ?? 'asc'
        }
    }

    function isSorted(field) {
        return sort.field === field
    }

    function sortIcon(field) {
        if(!isSorted(field)) {
            return null
        }

        return sort.direction === 'asc'
            ? ArrowUpNarrowWide
            : ArrowDownWideNarrow
    }

    return {
        sortBy,
        isSorted,
        sortIcon,
    }
}