<script setup lang="ts">
import { GithubOutlined } from '@antdv-next/icons'
import { useBreakpoint } from 'antdv-next'
import { ref, shallowRef } from 'vue'
import DirectionIcon from '@/components/icons/directionIcon.vue'
import SearchIcon from '@/components/icons/search.vue'
import { headerItems } from '@/config/menu/header'
import SwitchBtn from '@/layouts/base/components/switch-btn.vue'

const selectedKeys = ref<string[]>([])
const breakpoint = useBreakpoint()
const versions = ref([
  {
    label: '1.0.0',
    value: '1.0.0',
  },
])
const currentVersion = shallowRef('1.0.0')
const searchValue = shallowRef()
</script>

<template>
  <header
    class="ant-doc-header a-bg-container sticky top-0 z-1000 w-full a-shadow-ter backdrop-blur-8px"
  >
    <a-row>
      <a-col :xxl="4" :xl="5" :lg="6" :md="6" :sm="24" :xs="24">
        <h1 class="m-0 p-0">
          <a class="inline-flex items-center pl-40px h-[var(--ant-doc-header-height)] line-height-[var(--ant-doc-header-height)] text-18px font-bold a-color-text hover:a-color-text of-hidden" href="/">
            <img src="../../assets/antdv-next.svg" class="w-36px h-36px inline-block align-middle" draggable="false" alt="logo">
            <span class="ml-2">
              Antdv Next
            </span>
          </a>
        </h1>
      </a-col>
      <a-col :xxl="20" :xl="19" :lg="18" :md="18" :sm="0" :xs="0">
        <div class="ant-doc-header-right flex items-center pr-[var(--ant-padding)] gap-sm h-full">
          <div class="b-l-1 b-l-solid b-l-black/6 flex items-center m-0" style="flex: auto">
            <SearchIcon class="ant-doc-search-bar-svg" />
            <input v-model="searchValue" class="ant-doc-search-bar-input" placeholder="输入关键字搜索...">
          </div>
          <template v-if="breakpoint?.md">
            <a-menu
              v-model:selected-keys="selectedKeys"
              class="h-full border-b-none ant-doc-header-menu"
              mode="horizontal"
              :items="headerItems"
            />
            <div style="display: none" aria-hidden="true" />
            <a-select
              v-model:value="currentVersion"
              :options="versions"
              size="small"
              variant="filled"
              class="min-w-90px"
            />
            <SwitchBtn
              key="lang" :value="1" tooltip1="中文 / English"
              tooltip2="English / 中文"
            >
              <template #label1>
                中
              </template>
              <template #label2>
                En
              </template>
            </SwitchBtn>
            <SwitchBtn
              key="direction"
              :value="1"
              tooltip1="LTR"
              tooltip2="RTL"
              pure
              aria-label="RTL Switch Button"
            >
              <template #label1>
                <DirectionIcon class="w-20px" direction="ltr" />
              </template>
              <template #label2>
                <DirectionIcon class="w-20px" direction="rtl" />
              </template>
            </SwitchBtn>
            <a
              key="github"
              href="https://github.com/antdv-next/antdv-next"
              target="_blank"
              rel="noreferrer"
            >
              <a-tooltip title="GitHub" destroy-on-hidden>
                <a-button type="text" class="text-16px">
                  <template #icon>
                    <GithubOutlined />
                  </template>
                </a-button>
              </a-tooltip>
            </a>
          </template>
        </div>
      </a-col>
    </a-row>
  </header>
</template>

<style lang="less">
.ant-doc-header {
  height: var(--ant-doc-header-height);
}
.ant-doc-header a {
  white-space: nowrap;
  text-decoration: none;
}

.ant-doc-header-right {
  > * {
    flex: none;
    margin: 0;
  }
}
.ant-doc-header-menu {
  .ant-menu-item {
    height: var(--ant-doc-header-height);
    line-height: var(--ant-doc-header-height);
  }
}

.ant-doc-search-bar {
  &-svg {
    position: absolute;
    top: 50%;
    margin-top: 1px;
    //padding-left: 16px;
    inset-inline-start: 16px;
    width: 14px;
    fill: #ced4d9;
    transform: translateY(-50%);
  }

  &-input {
    width: 280px;
    height: 22px;
    border: 0;
    max-width: calc(100vw - 768px);
    padding: 0;
    padding-inline-start: 40px;
    padding-inline-end: 12px;
    font-size: 14px;
    border-radius: 20px;
    box-sizing: border-box;
    outline: none;
    transition: all 0.3s;
    color: rgba(0, 0, 0, 0.88);
    background: #ffffff;
  }
}
</style>
