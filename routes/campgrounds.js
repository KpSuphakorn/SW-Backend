const express = require('express');
const {
  getCampgrounds,
  getCampground,
  createCampground,
  updateCampground,
  deleteCampground,
} = require('../controllers/campgrounds');
const reservationRouter = require('./reservations');
const commentRouter = require('./comments');
const router = express.Router();
const { protect, authorize } = require('../middleware/user');

/**
 * @swagger
 * components:
 *   securityDefinitions:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   securitySchemes:
 *     bearerAuth:
 *       type: apiKey
 *       name: Authorization
 *       in: header
 *   schemas:
 *     Campground:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - district
 *         - province
 *         - region
 *         - postalcode
 *         - tel
 *         - url
 *         - maxReservations
 *         - coverpicture
 *         - picture
 *         - description
 *         - price
 *         - rating
 *       properties:
 *         name:
 *           type: string
 *           description: Campground name
 *         address:
 *           type: string
 *           description: House No., Street, Road
 *         district:
 *           type: string
 *           description: District
 *         province:
 *           type: string
 *           description: Province
 *         region:
 *           type: string
 *           description: Region
 *         postalcode:
 *           type: string
 *           description: 5-digit postal code
 *         tel:
 *           type: string
 *           description: Telephone number
 *         url:
 *           type: string
 *           description: URL
 *         maxReservations:
 *           type: number
 *           description: Maximum reservations allowed
 *         coverpicture:
 *           type: string
 *           description: URL of the cover picture
 *         picture:
 *           type: array
 *           items:
 *             type: string
 *             description: URL of a picture
 *         description:
 *           type: string
 *           description: Description of the campground
 *         price:
 *           type: number
 *           description: Price per night
 *         rating:
 *           type: number
 *           description: Rating of the campground
 *         comments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *           description: Array of comments associated with the campground
 *         tags:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Tag'
 *           description: Array of tags associated with the campground
 *       example:
 *         name: "Happy Campground"
 *         address: "123 Main St"
 *         district: "Sample District"
 *         province: "Sample Province"
 *         region: "Sample Region"
 *         postalcode: "12345"
 *         tel: "123-456-7890"
 *         url: "https://www.happycampground.com"
 *         maxReservations: 5
 *         coverpicture: "https://www.happycampground.com/cover.jpg"
 *         picture: ["https://www.happycampground.com/pic1.jpg", "https://www.happycampground.com/pic2.jpg"]
 *         description: "A wonderful campground for a relaxing vacation"
 *         price: 50
 *         rating: 4.5
 *         comments: [
 *           "6621ddde8a80037d991c764a",
 *           "6621dde68a80037d991c765e"
 *         ]
 *         tags: [
 *           "662fce02d9a351676a690d68",
 *           "662fcdded9a351676a690d5c",
 *           "662fcdb3d9a351676a690d4d"
 *         ]
 *     Tag:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the tag.
 *           example: Adventure
 *       required:
 *         - name
 *       example: 
 *         name: "Adventure"
 *     Comment:
 *       type: object
 *       required:
 *         - campground_id
 *         - user_id
 *         - user_rating
 *       properties:
 *         campground_id:
 *           type: string
 *           description: The ID of the campground this comment belongs to.
 *           example: 609bda561452242d88d36e37
 *         user_id:
 *           type: string
 *           description: The ID of the user who posted the comment.
 *           example: 609bda561452242d88d36e38
 *         text:
 *           type: string
 *           description: The text content of the comment.
 *           example: "This campground is amazing!"
 *         user_rating:
 *           type: number
 *           description: The rating given by the user for the campground.
 *           minimum: 1
 *           maximum: 5
 *           example: 5
 *       example:
 *         campground_id: "609bda561452242d88d36e37"
 *         user_id: "609bda561452242d88d36e38"
 *         text: "This campground is amazing!"
 *         user_rating: 5
 */

 /**
 * @swagger
 * tags:
 *   name: Campgrounds
 *   description: The campgrounds managing API
 *   security:
 *     - bearerAuth: []
 */

/**
* @swagger
* /campgrounds:
*   get:
*       summary: Get all campgrounds
*       tags: [Campgrounds]
*       responses:
*           200:
*               description: The list of the campgrounds
*               content:
*                   application/json:
*                       schema:
*                           type: array
*                           items:
*                               $ref: '#/components/schemas/Campground'
*   post:
*       summary: Create a new campground
*       tags: [Campgrounds]
*       security:
*         - bearerAuth: ['admin']
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/Campground'
*       responses:
*           200:
*               description: The created campground
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Campground'
*           500:
*               description: Some server error
*/

/**
 * @swagger
 * /campgrounds/{campgroundId}:
 *   get:
 *       summary: Get a single campground by ID
 *       tags: [Campgrounds]
 *       parameters:
 *           - in: path
 *             name: campgroundId
 *             required: true
 *             description: ID of the campground
 *             schema:
 *               type: string
 *       responses:
 *           200:
 *             description: The campground
 *             content:
 *               application/json:
 *                 schema:
 *                   $ref: '#/components/schemas/Campground'
 *           404:
 *               description: Campground not found
 *
 *   put:
 *       summary: Update a campground by ID
 *       tags: [Campgrounds]
 *       security:
 *         - bearerAuth: ['admin']
 *       parameters:
 *           - in: path
 *             name: campgroundId
 *             required: true
 *             description: ID of the campground
 *             schema:
 *               type: string
 *       requestBody:
 *           required: true
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: '#/components/schemas/Campground'
 *       responses:
 *           200:
 *               description: The updated campground
 *               content:
 *                   application/json:
 *                       schema:
 *                           $ref: '#/components/schemas/Campground'
 *           404:
 *               description: Campground not found
 *   delete:
 *       summary: Delete a campground by ID
 *       tags: [Campgrounds]
 *       security:
 *         - bearerAuth: ['admin']
 *       parameters:
 *           - in: path
 *             name: campgroundId
 *             required: true
 *             description: ID of the campground
 *             schema:
 *               type: string
 *       responses:
 *           200:
 *               description: Success message
 *           404:
 *               description: Campground not found
 */

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: API endpoints for managing comments
 *   security:
 *     - bearerAuth: []
 */

/**
 * @swagger
 * /comments/{campgroundId}:
 *   get:
 *     summary: Get all comments for a campground
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: campgroundId
 *         required: true
 *         description: ID of the campground
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of comments for the campground
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 * 
 *   post:
 *     summary: Create a new comment for a campground
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: campgroundId
 *         required: true
 *         description: ID of the campground
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       200:
 *         description: The created comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: User not authorized to create a comment
 *       404:
 *         description: Campground not found
 * 
 * /comments/{campgroundId}/comment/{commentId}:
 *   put:
 *     summary: Update a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: campgroundId
 *         required: true
 *         description: ID of the campground
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: ID of the comment
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The text content of the comment
 *                 example: "fsoiem"
 *               user_rating:
 *                 type: number
 *                 description: The rating given by the user for the campground
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *             required:
 *               - text
 *               - user_rating

 *     responses:
 *       200:
 *         description: The updated comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: User not authorized to update the comment
 *       404:
 *         description: Comment not found
 * 
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: campgroundId
 *         required: true
 *         description: ID of the campground
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: ID of the comment
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success message
 *       401:
 *         description: User not authorized to delete the comment
 *       404:
 *         description: Comment not found
 */

/**
 * @swagger
 * tags:
 *   name: Tags
 *   description: API endpoints for managing tags
 *   security:
 *     - bearerAuth: []
 */

/**
 * @swagger
 * /tags:
 *   get:
 *     summary: Get all tags
 *     tags: [Tags]
 *     responses:
 *       200:
 *         description: A list of all tags
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 tags:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tag'
 *       400:
 *         description: Bad request
 * 
 *   post:
 *     summary: Create a new tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: ['admin']
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tag'
 *     responses:
 *       201:
 *         description: The created tag
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 tag:
 *                   $ref: '#/components/schemas/Tag'
 *       400:
 *         description: Bad request
 *
 * /tags/{tagId}:
 *   delete:
 *     summary: Delete a tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: ['admin']
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         description: ID of the tag
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       404:
 *         description: Tag not found
 *
 * /tags/campgrounds/{campgroundId}/tags:
 *   get:
 *     summary: Get all tags for a campground
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: campgroundId
 *         required: true
 *         description: ID of the campground
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of tags associated with the campground
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 tags:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tag'
 *       404:
 *         description: Campground not found
 * 
 * /tags/campgrounds/{campgroundId}/{tagId}:
 *   post:
 *     summary: Add a tag to a campground
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: ['admin']
 *     parameters:
 *       - in: path
 *         name: campgroundId
 *         required: true
 *         description: ID of the campground
 *         schema:
 *           type: string
 *       - in: path
 *         name: tagId
 *         required: true
 *         description: ID of the tag
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       400:
 *         description: Tag already exists in campground
 *       404:
 *         description: Campground or tag not found
 *   delete:
 *     summary: Remove a tag from a campground
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: ['admin']
 *     parameters:
 *       - in: path
 *         name: campgroundId
 *         required: true
 *         description: ID of the campground
 *         schema:
 *           type: string
 *       - in: path
 *         name: tagId
 *         required: true
 *         description: ID of the tag
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       404:
 *         description: Campground or tag not found
 *
* /tags/campgrounds/{campgroundId}/similar2:
*  get:
*    summary: Get campgrounds with similar tags
*    tags: [Tags]
*    parameters:
*      - in: path
*        name: campgroundId
*        required: true
*        description: ID of the campground
*        schema:
*          type: string
*    responses:
*      200:
*        description: A list of campgrounds with similar tags
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                success:
*                  type: boolean
*                data:
*                  type: array
*                  items:
*                    $ref: '#/components/schemas/Campground'
*      500:
*        description: Server error
 */

// Re-route into other resource routers
router.use('/:campgroundId/reservations/', reservationRouter);
router.use('/:id/comments', commentRouter); // Use the new comment router

router.route('/').get(getCampgrounds).post(protect, authorize('admin'), createCampground);
router
  .route('/:id')
  .get(getCampground)
  .put(protect, authorize('admin'), updateCampground)
  .delete(protect, authorize('admin'), deleteCampground);

module.exports = router;