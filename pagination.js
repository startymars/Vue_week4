export default{
    props:['pages', 'getProduct'], //使用props將模組化內容傳遞，並自訂名稱
    template:`<nav aria-label="Page navigation example">
   
    <ul class="pagination">
      <li class="page-item" :class="{ disabled: !pages.has_pre}">
        <a class="page-link" href="#" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>

      <li class="page-item" :class="{ active: page === pages.current_page}" v-for="page in pages.total_pages" :key="page+'page'">
        <a class="page-link" href="#"  @click.prevent="$emit('emit-change',page)">{{page}}</a>
      </li>
    

      <li class="page-item" :class="{ disabled: !pages.has_next}">
        <a class="page-link" href="#" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>

    </ul>
  </nav>`
}

// @click.prevent="getProduct(page)">{{page}