<template>
	<div>
		<input type="hidden" :name="$session.tokenParamName" :value="$session.getToken()" />
	</div>
</template>

<script>
	export default {
		name: 'ss-input'
	}
</script>

<style>

</style>