export interface BaseResponse<T = any> {
    success: boolean;
    code: number;
    message: string;
    data: T;
}


/**
 * ==========================
 *  @FILTERS
 * ==========================
 */

export interface Filters {
    [key: string]: string | number | string[] | undefined;
}

/**
 * ==========================
 *  @PAGINATION
 * ==========================
 */

export interface PaginationData {
    total_page: number;
    page_size: number;
    current_page: number;
    total: number;
}