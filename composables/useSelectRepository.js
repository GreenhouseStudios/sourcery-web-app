export default function useSelectRepository() {

    const bannerFallback = ref('/img/fallbacks/default-header-80opat.jpg')
    const repository = ref()

    const bannerImage = computed(() => {
        return repository.value?.featured_image?.url ?? repository.value?.oraganization?.featured_image?.url ?? bannerFallback.value
    })

    return {
        bannerFallback,
        bannerImage,
        repository
    }

}