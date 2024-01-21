// import { AcceptPlatform, ICacheKey } from '@madify-api/database';
// import {
//   AuthGuard,
//   HttpCacheClearInterceptor,
//   HttpCacheIndividualInterceptor,
//   HttpCacheSharedWithQueryInterceptor,
// } from '@madify-api/utils/interceptor';
// import { CacheKey } from '@nestjs/cache-manager';
// import {
//   CacheTTL,
//   UseGuards,
//   UseInterceptors,
//   applyDecorators,
// } from '@nestjs/common';
// import { ApiBearerAuth, ApiHeaders } from '@nestjs/swagger';

// export const MadifyAuthorize = (cacheConfig: ICacheKey) => {
//   return applyDecorators(
//     ApiBearerAuth('JSON Web Token Authorization'),
//     CacheKey(cacheConfig.name),
//     CacheTTL(cacheConfig.ttl),
//     UseInterceptors(HttpCacheIndividualInterceptor),
//     UseGuards(AuthGuard)
//   );
// };

// export const MadifyAuthorizeAndClearCached = (cacheConfig: ICacheKey) => {
//   return applyDecorators(
//     ApiBearerAuth('JSON Web Token Authorization'),
//     CacheKey(cacheConfig.name),
//     UseGuards(AuthGuard),
//     UseInterceptors(HttpCacheClearInterceptor)
//   );
// };

// export const MadifySharedCached = (cacheConfig: ICacheKey) => {
//   return applyDecorators(
//     CacheKey(cacheConfig.name),
//     CacheTTL(cacheConfig.ttlShared),
//     UseInterceptors(HttpCacheSharedWithQueryInterceptor)
//   );
// };

// export const MadifySwaggerHeaderAuth = () => {
//   return applyDecorators(
//     ApiHeaders([
//       {
//         name: 'platform',
//         description: 'This header is required',
//         enum: AcceptPlatform,
//         example: AcceptPlatform.Web,
//         required: true,
//       },
//       {
//         name: 'uuid',
//         description: 'This header is required',
//         example: 'uuid',
//         required: true,
//       },
//     ])
//   );
// };
