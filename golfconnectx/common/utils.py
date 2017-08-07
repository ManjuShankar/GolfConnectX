from django.conf import settings
from django.core.paginator import Paginator

NUMBER_DISPLAYED = 5
NUMBER_DISPLAYED_DASH = 10

LEADING_PAGE_RANGE_DISPLAYED = TRAILING_PAGE_RANGE_DISPLAYED =8
LEADING_PAGE_RANGE = TRAILING_PAGE_RANGE = 5
NUM_PAGES_OUTSIDE_RANGE = 2
ADJACENT_PAGES = 1


def ds_pagination(objects,page,temp_var,result_per_page):
    
    paginator = Paginator(objects, result_per_page)
    count = paginator.count

    in_leading_range = in_trailing_range = False
    pages_outside_leading_range = pages_outside_trailing_range = range(0)
    (pages) = paginator.num_pages
    if pages<page:
        page=1
    if (pages <= LEADING_PAGE_RANGE_DISPLAYED):
        in_leading_range = in_trailing_range = True
        page_numbers = [n for n in range(1, pages + 1) if n > 0 and n <= pages]
    elif (page+1 <= LEADING_PAGE_RANGE):
        in_leading_range = True
        page_numbers = [n for n in range(1, LEADING_PAGE_RANGE_DISPLAYED - NUM_PAGES_OUTSIDE_RANGE +1) if n > 0 and n <= pages]
        pages_outside_leading_range = [n + pages for n in range(0, -NUM_PAGES_OUTSIDE_RANGE, -1)]
    elif (page+1 > pages - TRAILING_PAGE_RANGE):
        in_trailing_range = True
        page_numbers = [n for n in range(pages - TRAILING_PAGE_RANGE_DISPLAYED + NUM_PAGES_OUTSIDE_RANGE +1 , pages + 1) if n > 0 and n <= pages]
        pages_outside_trailing_range = [n + 1 for n in range(0, NUM_PAGES_OUTSIDE_RANGE)]
    else: 
        page_numbers = [n for n in range(page - ADJACENT_PAGES, page+1 + ADJACENT_PAGES +1) if n > 0 and n <= pages]
        pages_outside_leading_range = [n + pages for n in range(0, -NUM_PAGES_OUTSIDE_RANGE, -1)]
        pages_outside_trailing_range = [n + 1 for n in range(0, NUM_PAGES_OUTSIDE_RANGE)]

    paginator2 = paginator.page(page)
    if pages==1:
        is_paginated = False
    else:
        is_paginated = True
    from_range= ((page-1)*result_per_page) + 1   
    if paginator2.has_next():
        to_range=page*result_per_page
    else:
        to_range=count
    next_page_number = previous_page_number = None 
    try:
        next_page_number = paginator2.next_page_number()
    except: pass
    try:
        previous_page_number = paginator2.previous_page_number()
    except: pass
    data = {            
            'count':count,
            'page':page,
            'pages':pages,
            'from_range':from_range,
            'to_range':to_range,
            'results_per_page': result_per_page,
            'is_paginated': is_paginated,
            'current_page':page,
             temp_var:paginator2.object_list,
            'next':next_page_number,
            'prev':previous_page_number,
            'has_next':paginator2.has_next(),
            'has_previous':paginator2.has_previous(),
            'page_numbers': page_numbers,
            'in_leading_range': in_leading_range,
            'in_trailing_range': in_trailing_range,
            'pages_outside_leading_range': pages_outside_leading_range,
            'pages_outside_trailing_range': pages_outside_trailing_range
            
            }
    return data