using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class MembersController(IMemberRepository memberRepository) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Member>>> GetMembers()
        {
            var members = await memberRepository.GetMembersAsync();
            return members.Count > 0 ? Ok(members) : NotFound();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Member>> GetMember(string id)
        {
            return await memberRepository.GetMemberByIdAsync(id) switch
            {
                Member member => Ok(member),
                null => NotFound()
            };
        }

        [HttpGet("{memberId}/photos")]
        public async Task<ActionResult<IReadOnlyList<Photo>>> GetPhotosByMemberId(string memberId)
        {
            var photos = await memberRepository.GetPhotosByMemberIdAsync(memberId);
            return photos.Count > 0 ? Ok(photos) : NotFound();
        }
    }
}
