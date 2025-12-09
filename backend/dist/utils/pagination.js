"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_PAGE_SIZE = exports.DEFAULT_PAGE_SIZE = void 0;
exports.getPagination = getPagination;
exports.DEFAULT_PAGE_SIZE = 10;
exports.MAX_PAGE_SIZE = 100;
function getPagination(page = 1, pageSize = exports.DEFAULT_PAGE_SIZE) {
    const safePage = page < 1 ? 1 : page;
    const safeSize = pageSize < 1 ? exports.DEFAULT_PAGE_SIZE : Math.min(pageSize, exports.MAX_PAGE_SIZE);
    const from = (safePage - 1) * safeSize;
    const to = from + safeSize - 1;
    return { from, to, page: safePage, pageSize: safeSize };
}
